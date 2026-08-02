from app.ai.prompts.context_builder import ContextBuilder
from app.models.restaurant import Restaurant

class MockQuery:
    def __init__(self, items):
        self.items = items
    def filter(self, *args, **kwargs):
        return self
    def first(self):
        return self.items[0] if self.items else None
    def all(self):
        return self.items

class MockDB:
    def query(self, model):
        if model == Restaurant:
            return MockQuery([Restaurant(id="1", name="Spice Symphony")])
        return MockQuery([])

def test_context_builder_basic(mocker):
    mocker.patch('app.ai.prompts.context_builder.RecommendationService.get_recommendations', return_value=type('Response', (), {'recommendations': []})())
    
    db = MockDB()
    builder = ContextBuilder(db)
    ctx = builder.build_context("user_1", "1", "menu_browse", None)
    
    assert ctx["restaurant_name"] == "Spice Symphony"
    assert ctx["page_context"] == "menu_browse"
    assert "Unknown (No profile found)" in ctx["profile_text"]
