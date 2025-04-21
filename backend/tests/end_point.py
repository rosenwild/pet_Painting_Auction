
from fastapi.testclient import TestClient
from conftest import test_client, painting_payload, painting_update_payload
import pytest
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app
import time




def test_create_painting(test_client, painting_payload):
    response = test_client.post('/paintings/create', json=painting_payload)
    assert response.status_code == 201
    created_painting = response.json()
    assert created_painting["name"] == painting_payload["name"]
    assert created_painting["photo"] == painting_payload["photo"]
    assert created_painting["author"] == painting_payload["author"]
    assert created_painting["price"] == painting_payload["price"]
    assert created_painting["type"] == painting_payload["type"]

def test_get_paintings(test_client):
    response = test_client.get('/paintings/')
    assert response.status_code == 200
    data = response.json()
    print(data)

def test_delete_paintings(test_client, painting_payload):
    
    response = test_client.post('/paintings/create', json=painting_payload)
    assert response.status_code == 201
    data = response.json()
    painting_id = data["id"]
    response = test_client.delete(url=f"/paintings/delete/{painting_id}")
    assert response.status_code == 204


def test_create_update(test_client, painting_payload, painting_update_payload):
    response = test_client.post('/paintings/create', json=painting_payload)
    assert response.status_code == 201, f"Create response: {response.text}"
    created_painting = response.json()
    painting_id = created_painting["id"]
    
    time.sleep(5)

    print(f"Created painting ID: {painting_id}")

    response = test_client.put(f"/paintings/update/{painting_id}", json=painting_update_payload)
    assert response.status_code == 200, f"Update response: {response.text}"
    
    updated_painting = response.json()

    print(f"Updated painting: {updated_painting}")

    assert updated_painting["name"] == painting_update_payload["name"]
    assert updated_painting["photo"] == painting_update_payload["photo"]
    assert updated_painting["author"] == painting_update_payload["author"]
    assert updated_painting["price"] == painting_update_payload["price"]
    assert updated_painting["type"] == painting_update_payload["type"]


