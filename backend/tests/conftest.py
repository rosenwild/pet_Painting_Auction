import pytest 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Base, get_db
from main import app

test_db_url = "postgresql+psycopg2://postgres:password@127.0.0.1:5432/test_postgres"
engine = create_engine(test_db_url)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

class CustomTestClient(TestClient):
    def delete_with_payload(self,  **kwargs):
        return self.request(method="DELETE", **kwargs)

@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session 
    session.close()
    #transaction.rollback()  #так таблица будет откатываться к началу
    transaction.commit()  #так таблица будет сохранять данные
    connection.close()

@pytest.fixture(scope="function")
def test_client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    app.dependency_overrides[get_db] = override_get_db
    with CustomTestClient(app) as test_client:
        yield test_client

@pytest.fixture()
def painting_id() -> uuid.UUID:
    return str(uuid.uuid4())

@pytest.fixture()
def painting_payload():
    return{
        "name": "A Girl with Flowers on the Grass",
        "photo": "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=2190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "author": "Maris",
        "price": 8000,
        "type": "Impressionism"
    }


@pytest.fixture()
def painting_update_payload():
    return{
        "name": "A Girl with Flowers on the Grass",
        "photo": "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=2190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "author": "Maris",
        "price": 10000,
        "type": "Impressionism"
    }