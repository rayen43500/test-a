from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import getpass

User = get_user_model()

class Command(BaseCommand):
    help = 'Create an admin user'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Admin email')
        parser.add_argument('--username', type=str, help='Admin username')
        parser.add_argument('--fullname', type=str, help='Admin full name')
        parser.add_argument('--password', type=str, help='Admin password')

    def handle(self, *args, **options):
        email = options.get('email') or input('Admin email: ')
        username = options.get('username') or input('Admin username: ')
        fullname = options.get('fullname') or input('Admin full name: ')
        password = options.get('password') or getpass.getpass('Admin password: ')

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                fullname=fullname,
                role='Admin',
                is_staff=True,
                is_superuser=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created admin user: {fullname} ({email})'
                )
            )
            
        except IntegrityError as e:
            if 'username' in str(e):
                self.stdout.write(
                    self.style.ERROR(f'Error: Username "{username}" already exists')
                )
            elif 'email' in str(e):
                self.stdout.write(
                    self.style.ERROR(f'Error: Email "{email}" already exists')
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'Error creating user: {e}')
                )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating user: {e}')
            )