import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartfinance.settings')
django.setup()

from django.contrib.auth import get_user_model
from transactions.models import Category

User = get_user_model()

# Create default categories
default_categories = [
    {'name': 'Salary', 'type': 'income', 'icon': 'briefcase', 'color': '#10B981', 'is_default': True},
    {'name': 'Freelance', 'type': 'income', 'icon': 'laptop', 'color': '#059669', 'is_default': True},
    {'name': 'Investment', 'type': 'income', 'icon': 'trending-up', 'color': '#34D399', 'is_default': True},

    {'name': 'Food & Dining', 'type': 'expense', 'icon': 'utensils', 'color': '#EF4444', 'is_default': True},
    {'name': 'Transportation', 'type': 'expense', 'icon': 'car', 'color': '#F59E0B', 'is_default': True},
    {'name': 'Shopping', 'type': 'expense', 'icon': 'shopping-bag', 'color': '#8B5CF6', 'is_default': True},
    {'name': 'Entertainment', 'type': 'expense', 'icon': 'film', 'color': '#EC4899', 'is_default': True},
    {'name': 'Healthcare', 'type': 'expense', 'icon': 'heart', 'color': '#DC2626', 'is_default': True},
    {'name': 'Utilities', 'type': 'expense', 'icon': 'zap', 'color': '#F97316', 'is_default': True},
    {'name': 'Rent', 'type': 'expense', 'icon': 'home', 'color': '#0EA5E9', 'is_default': True},
    {'name': 'Education', 'type': 'expense', 'icon': 'book', 'color': '#6366F1', 'is_default': True},
    {'name': 'Other', 'type': 'expense', 'icon': 'more-horizontal', 'color': '#6B7280', 'is_default': True},
]

print("Creating default categories...")
for cat_data in default_categories:
    category, created = Category.objects.get_or_create(
        name=cat_data['name'],
        type=cat_data['type'],
        defaults={
            'icon': cat_data['icon'],
            'color': cat_data['color'],
            'is_default': cat_data['is_default']
        }
    )
    if created:
        print(f"✓ Created category: {category.name}")
    else:
        print(f"- Category already exists: {category.name}")

print("\n✅ Seed data created successfully!")
print("\nYou can now run the server with: python manage.py runserver")
