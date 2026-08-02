import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

async def test_apis():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        r_rest = await ac.get("/api/v1/restaurant")
        print(f"/restaurant: {r_rest.status_code}")
        
        r_cat = await ac.get("/api/v1/categories")
        print(f"/categories: {r_cat.status_code}")
        
        r_dishes = await ac.get("/api/v1/dishes")
        print(f"/dishes: {r_dishes.status_code}")
        if r_dishes.status_code == 200:
            dishes = r_dishes.json().get("data", [])
            if dishes:
                r_dish = await ac.get(f"/api/v1/dish/{dishes[0]['id']}")
                print(f"/dish/id: {r_dish.status_code}")

if __name__ == "__main__":
    asyncio.run(test_apis())
