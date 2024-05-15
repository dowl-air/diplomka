FROM selenium/standalone-chrome

USER root
RUN wget https://bootstrap.pypa.io/get-pip.py
RUN python3 get-pip.py

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

EXPOSE 5000

# Set the command to run the application
CMD [ "python3", "main.py" ]