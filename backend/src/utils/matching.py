import json
from typing import List
from src.db.models import CSVFile, Company, EntityMatch
from urllib.parse import urlparse
from rapidfuzz import process, fuzz
import os
from pathlib import Path


json_file_path = "./src/json/entities.json"

print(f"is direcotry: {os.path.exists("./src/json")}")
json_file = open(json_file_path)
json_data = json.load(json_file)


def extract_domain(url: str):
    parsed = urlparse(url.strip().lower())
    domain = parsed.netloc or parsed.path
    return domain.replace("www.", "").strip("/")

def normalize_name(name: str):
    return name.lower().strip().replace("@", "")


def match_entity(companies: List[Company]):
    entity_matches = []
    entity_db = []
    for company in companies:
        normalized_name = normalize_name(company.name)

        name_candidates = []
        for key, entity in json_data.items():
            if entity.get("type") in ["Company", "Username", "InternetDomainName"]:
                fields = [entity.get("name"), entity.get("display_name")] + entity.get("common_names", [])
                for f in fields:
                    if f:
                        score = fuzz.ratio(normalized_name, normalize_name(f))
                        if score > 80:
                            print(entity)
                            filtered_entity = filtering_entity(entity)
                            name_candidates.append((score, key, filtered_entity))
                            entity_db.append(EntityMatch(name=filtered_entity["name"], type=filtered_entity['type'], company_id=company.id))
        name_candidates.sort(reverse=True)

        entity_matches.append({
           company.name: name_candidates
        })

    return {
        "entity_matches": entity_matches,
        "entity_db": entity_db
    }

def filtering_entity(entity):
    return {"name": entity["name"], "type": entity["type"]}


