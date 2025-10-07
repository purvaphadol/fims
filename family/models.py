from django.db import models
from auditlog.registry import auditlog
import uuid
from .utils import encode_id

class statusChoice(models.IntegerChoices):
    ACTIVE = 1
    INACTIVE = 0
    DELETE = 9

class MaritalStatus(models.TextChoices):
    MARRIED = "Married"
    UNMARRIED = "Unmarried"

class BaseModel(models.Model):
    status = models.IntegerField(
        choices = statusChoice.choices,
        default = statusChoice.ACTIVE.value,
    )

    class Meta:
        abstract = True

    def soft_delete(self):
        self.status = statusChoice.DELETE
        self.save(update_fields=['status'])

    def delete(self, *args, **kwargs):
        self.soft_delete()

    def set_status(self, new_status):
        self.status = new_status
        self.save(update_fields=['status'])

    
class State(BaseModel):
    state_name = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices = statusChoice.choices, default=statusChoice.ACTIVE.value)

    class Meta:
        db_table = "state"
        ordering = ["state_name"]

    @property
    def hashid(self):
        return encode_id(self.pk)

    def __str__(self):
        return self.state_name

    def soft_delete(self):
        super().soft_delete()
        self.city_set.update(status=statusChoice.DELETE)
        heads = self.familyhead_set.all()
        heads.update(status=statusChoice.INACTIVE)
        FamilyMember.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)
        Hobby.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)
    
    def set_status(self, new_status):
        super().set_status(new_status)
        if new_status == statusChoice.ACTIVE:
            self.city_set.update(status=statusChoice.ACTIVE)
            heads = self.familyhead_set.all()
            heads.update(status=statusChoice.ACTIVE)
            FamilyMember.objects.filter(family_head__in=heads).update(status=statusChoice.ACTIVE)
            Hobby.objects.filter(family_head__in=heads).update(status=statusChoice.ACTIVE)
        elif new_status == statusChoice.INACTIVE:
            self.city_set.update(status=statusChoice.INACTIVE)
            heads = self.familyhead_set.all()
            heads.update(status=statusChoice.INACTIVE)
            FamilyMember.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)
            Hobby.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)

auditlog.register(State)


class City(BaseModel):
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    city_name = models.CharField(max_length=40)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices = statusChoice.choices, default=statusChoice.ACTIVE.value)

    class Meta:
        db_table = "city"
    
    @property
    def hashid(self):
        return encode_id(self.pk)

    def __str__(self):
        return self.city_name

    def soft_delete(self):
        super().soft_delete()
        heads = self.familyhead_set.all()
        heads.update(status=statusChoice.INACTIVE)
        FamilyMember.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)
        Hobby.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)

    def set_status(self, new_status):
        super().set_status(new_status)
        if new_status == statusChoice.ACTIVE:
            heads = self.familyhead_set.all()
            heads.update(status=statusChoice.ACTIVE)
            FamilyMember.objects.filter(family_head__in=heads).update(status=statusChoice.ACTIVE)
            Hobby.objects.filter(family_head__in=heads).update(status=statusChoice.ACTIVE)
        elif new_status == statusChoice.INACTIVE:
            heads = self.familyhead_set.all()
            heads.update(status=statusChoice.INACTIVE)
            FamilyMember.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)
            Hobby.objects.filter(family_head__in=heads).update(status=statusChoice.INACTIVE)

auditlog.register(City)


class FamilyHead(BaseModel):
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    dob = models.DateField()
    mobno = models.CharField(max_length=15)
    address = models.TextField()
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null = True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null = True, blank=True)
    pincode = models.CharField(max_length=6)
    marital_status = models.CharField(max_length=10, choices=MaritalStatus.choices, default='')
    wedding_date = models.DateField(null=True, blank=True)
    photo = models.ImageField(upload_to="pictures")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices = statusChoice.choices, default=statusChoice.ACTIVE.value)

    class Meta:
        db_table = "family_head"
        ordering = ['-updated_at', '-created_at']

    @property
    def hashid(self):
        return encode_id(self.pk)

    def __str__(self):
        return self.name

    def soft_delete(self):
        super().soft_delete()
        self.members.update(status=statusChoice.DELETE)
        self.hobbies.update(status=statusChoice.DELETE)

    def set_status(self, new_status):
        super().set_status(new_status)
        if new_status == statusChoice.ACTIVE:
            self.members.update(status=statusChoice.ACTIVE)
            self.hobbies.update(status=statusChoice.ACTIVE)
        elif new_status == statusChoice.INACTIVE:
            self.members.update(status=statusChoice.INACTIVE)
            self.hobbies.update(status=statusChoice.INACTIVE)

auditlog.register(FamilyHead)

    
class Hobby(models.Model):
    hobby = models.CharField(max_length=50)
    family_head = models.ForeignKey(FamilyHead, on_delete=models.CASCADE, related_name="hobbies")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices = statusChoice.choices, default=statusChoice.ACTIVE.value)
 
    class Meta:
        db_table = "hobby"

    @property
    def hashid(self):
        return encode_id(self.pk)

    def __str__(self):
        return self.hobby

auditlog.register(Hobby)


class FamilyMember(models.Model):
    family_head = models.ForeignKey(FamilyHead, on_delete=models.CASCADE, related_name="members")
    member_name = models.CharField(max_length=50)
    member_dob = models.DateField()
    member_marital = models.CharField(max_length=10, choices=MaritalStatus.choices, default='')
    member_wedDate = models.DateField(null=True, blank=True)
    education = models.CharField(max_length=10, null=True, blank=True)
    member_photo = models.ImageField(upload_to="pictures", null=True, blank=True)
    relation = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices = statusChoice.choices, default=statusChoice.ACTIVE.value)

    class Meta:
        db_table = "family_member"
    
    @property
    def hashid(self):
        return encode_id(self.pk)

    def __str__(self):
        return self.member_name

auditlog.register(FamilyMember)

    
    