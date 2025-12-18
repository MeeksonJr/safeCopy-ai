# rag_pipeline/scraper.py
import requests
from bs4 import BeautifulSoup
import os

def scrape_website(url, output_dir="scraped_data"):
    """Scrapes text content from a given URL and saves it to a file."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an exception for HTTP errors

        soup = BeautifulSoup(response.text, 'html.parser')
        # Extract all text, for a real scenario, you'd be more selective
        text_content = soup.get_text(separator=' ', strip=True)

        # Use a sanitized version of the URL for the filename
        filename = os.path.join(output_dir, url.replace('https://', '').replace('http://', '').replace('/', '_') + '.txt')
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(text_content)
        print(f"Successfully scraped {url} to {filename}")
        return filename
    except requests.exceptions.RequestException as e:
        print(f"Error scraping {url}: {e}")
        return None

if __name__ == "__main__":
    # Example usage: Replace with actual .gov sites
    # In a real scenario, this would be a list of relevant regulatory pages.
    urls_to_scrape = [
        "https://www.ftc.gov/news-events/topics/advertising-marketing",
        "https://www.sec.gov/rules/finra",
        "https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act"
    ]

    for url in urls_to_scrape:
        scrape_website(url)

