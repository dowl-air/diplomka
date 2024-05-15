# Strukturovaná Data na WWW

Tento projekt se zaměřuje na sémantický web, jeho klíčové technologie a reprezentaci strukturovaných dat na webu. Aplikace umožňuje procházení strukturovaných dat ve webových stránkách a jejich propojení s obecnými znalostními bázemi jako Wikidata a DBpedia.

## Popis projektu

- **Autor**: Bc. Daniel Pátek
- **Vedoucí práce**: doc. Ing. Radek Burget, Ph.D.
- **Fakulta**: Fakulta informačních technologií, Vysoké učení technické v Brně
- **Obor**: Informační technologie a umělá inteligence

### Hlavní cíle projektu

1. Prozkoumání existujících technologií sémantického webu.
2. Návrh a implementace aplikace pro procházení strukturovaných dat na webových stránkách.
3. Integrace aplikace s obecnými znalostními bázemi.
4. Testování aplikace na vhodné množině stránek.

## Technologie

Projekt využívá následující technologie a nástroje:

- **Frontend**: Next.js, React, HTML, CSS
- **Backend**: Python, Flask
- **Další nástroje**: Docker, Docker Compose

## Požadavky

- Docker
- Docker Compose
- Node.js (pro frontend vývoj)
- Python 3 (pro backend vývoj)

## Instalace a spuštění

### Docker Compose

Pro spuštění aplikace pomocí Docker Compose, použijte následující příkaz:

```bash
docker-compose up --build
```

Tento příkaz sestaví a spustí aplikaci ve dvou kontejnerech: jeden pro frontend a druhý pro backend.

## Testování

Spuštění aplikace bylo testováno na následující konfiguraci:

- **OS**: Ubuntu 22.04.4 LTS 64bit
- **CPU**: Intel Core i7
- **RAM**: 16 GB

## Vývoj

### Frontend

Je zapotřebí mít nainstalovaný `Node.js` ve verzi 20 a `npm` ve verzi 10.

Pro spuštění vývojového serveru pro frontend přejděte do složky frontend a spusťte:

```bash
npm run dev
```

### Backend

Je zapotřebí mít nainstalovaný `python3` ve verzi 3.10.

Pro spuštění backendu přejděte do složky backend a spusťte:

```bash
python3 main.py
```

Tento projekt byl vytvořen jako součást diplomové práce na Fakultě informačních technologií Vysokého učení technického v Brně.