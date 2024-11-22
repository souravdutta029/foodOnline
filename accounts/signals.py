from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserProfile

# ways to connect signal and receiver
# post_save.connect(post_save_create_profile_receiver, sender=User)
# we can also use decorator
@receiver(post_save, sender=User)
def post_save_create_profile_receiver(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        try:
            profile = UserProfile.objects.get(user=instance)
            profile.save()
        except:
            # create user profile if not exists
            UserProfile.objects.create(user=instance)