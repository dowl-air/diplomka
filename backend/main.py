from flask import Flask, request, jsonify, Response, current_app
import requests
import json
from time import sleep
from flask_cors import CORS

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

options = webdriver.ChromeOptions()
options.add_experimental_option("detach", True)
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-gpu")
options.add_argument("--disable-dev-shm-usage")

app = Flask(__name__)

cors = CORS(app, origins=["http://localhost:3000"])


# event for SSE
def event(data):
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"


def get_url_content(url):
    """
    This function fetches a webpage and returns the HTML content using BeautifulSoup
    """

    # Configure Chrome driver (replace path as needed)
    driver = webdriver.Chrome(options=options)
    driver.get(url)

    # Wait for page to load (adjust timeout as needed)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )

    # Get the page source
    page_source = driver.page_source

    # Parse the HTML
    soup = BeautifulSoup(page_source, "html.parser")

    driver.quit()

    return soup


def extract_schema_data(html_content):
    """
    This function extracts schema.org data from HTML content using BeautifulSoup

    Args:
        html_content: The HTML content as a string

    Returns:
        A list of dictionaries, where each dictionary represents the data for a schema.org object
    """

    if not html_content:
        return None

    # Find all items with vocab or typeof attributes (adjust as needed)
    schema_items = html_content.find_all(attrs={"vocab": True, "typeof": True})

    extracted_data = []
    for item in schema_items:
        data = {}
        data["@context"] = item.get("vocab", "")  # Get the context
        data["@type"] = item.get("typeof", "")  # Get the object type

        # Extract properties using itemtype or itemprop (adjust as needed)
        for prop in item.find_all(attrs={"itemtype": True, "itemprop": True}):
            property_name = prop.get("itemtype", prop.get("itemprop", ""))
            # Handle multiple values with a list (adjust as needed)
            value = (
                prop.text.strip()
                if not prop.find_all(text=True)
                else [t.strip() for t in prop.find_all(text=True)]
            )
            data[property_name] = value

        # Additional processing for specific properties (optional)
        # For example, extract phone numbers with regular expressions
        if "telephone" in data:
            data["telephone"] = re.sub(r"[^\d+]", "", data["telephone"])

        extracted_data.append(data)

    return extracted_data


def get_structured_data(html_content):
    """
    This function fetches a webpage, waits for JS to load, and tries to extract structured data (JSON-LD or RDFa)

    Args:
        url: The URL of the webpage

    Returns:
        A dictionary containing extracted structured data or None if not found
    """

    if not html_content:
        return None

    # Find JSON-LD or RDFa scripts
    script_data = []

    for script in html_content.find_all("script"):
        if script.get("type") == "application/ld+json":
            script_content = script.string.strip()
            try:
                parsed_data = json.loads(script_content)
                script_data.append(parsed_data)
            except Exception as e:
                print(f"Error parsing JSON-LD: {e}")
        elif "rdf" in script.get("type", ""):  # Check for RDFa (less common)
            script_content = script.string.strip()
            try:
                parsed_data = script_content
                script_data.append(parsed_data)
            except Exception as e:
                print(f"Error parsing RDFa: {e}")

    # Try parsing JSON-LD if found
    if len(script_data):
        return script_data
    else:
        return None


def build_dbpedia_query_url(search_term):
    # todo surface form search (RDFC label) - regex
    query = (
        f"SELECT DISTINCT ?s WHERE {{ "
        f"?s ?p ?o . "
        f"?s ?p2 ?o2 . "
        f'FILTER (regex(str(?s), "{search_term}", "i") || regex(str(?o), "{search_term}", "i") || regex(str(?o2), "{search_term}", "i")) '
        f"}}"
    )
    url = f"http://dbpedia.org/sparql?query={query}"
    return url


# Function to search on DBPedia
def search_dbpedia(search_term):
    url = f"https://lookup.dbpedia.org/api/search?query={search_term}&maxResults=2&format=JSON"
    response = requests.get(url, headers={"Accept": "application/json"})
    if response.status_code == 200:
        return response.json()
    else:
        return None


# Function to search on WikiData
def search_wikidata(search_term):
    url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={search_term}&format=json&language=en"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None


# API endpoint for search
@app.route("/search")
def search():
    q = request.args.get("q")

    if not q:
        return jsonify({"error": "No search term provided"})

    search_terms = json.loads(q)

    if not search_terms:
        return jsonify({"error": "No search term provided"})

    result = []

    for index, term in enumerate(search_terms):
        wikidata_results = search_wikidata(term)
        dbpedia_results = search_dbpedia(term)
        result.append(
            {
                "searchTerm": term,
                "index": index,
                "DBPedia": dbpedia_results,
                "WikiData": wikidata_results,
            }
        )

    return jsonify(result)


@app.route("/scan")
def scan():
    url_address = request.args.get("url")
    if url_address:
        html_content = get_url_content(url_address)
        data = get_structured_data(html_content=html_content)
        schema = extract_schema_data(html_content=html_content)

        return data or schema or jsonify({"error": "No structured data found"})
    else:
        return jsonify({"error": "No URL provided"})


@app.route("/scan-sse")
def scan_sse():
    url_address = request.args.get("url")

    def generate():
        if not url_address:
            yield event({"error": "No URL provided"})
            return

        yield event({"message": "Fetching URL content..."})
        html_content = get_url_content(url_address)

        yield event({"message": "Extracting structured data..."})
        data = get_structured_data(html_content=html_content)

        yield event({"message": "Extracting schematic data..."})
        schema = extract_schema_data(html_content=html_content)

        # Send final data
        if data:
            yield event({"result": data})
        elif schema:
            yield event({"result": schema})
        else:
            yield event({"error": "No structured data found"})
            return

        yield event({"complete": True})

    return Response(generate(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
