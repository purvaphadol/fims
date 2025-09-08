from django import forms
from django.forms import ModelForm, inlineformset_factory
from .models import FamilyHead, City, Hobby, FamilyMember

class FamilyHeadForm(ModelForm):
    class Meta:
        model = FamilyHead
        fields = [
            "name", "surname", "dob", "mobno", "address",
            "state", "city", "pincode",
            "marital_status", "wedding_date", "photo"
        ]
        widgets = {
            "dob": forms.DateInput(attrs={"type": "date"}),
            "wedding_date": forms.DateInput(attrs={"type": "date"}),
            "marital_status": forms.RadioSelect(), 
            'name': forms.TextInput(attrs={'autocomplete': 'name'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['name'].required = False
        self.fields['surname'].required = False
        self.fields['dob'].required = False
        self.fields['mobno'].required = False
        self.fields['address'].required = False
        self.fields['pincode'].required = False
        self.fields["wedding_date"].required = False
        self.fields["photo"].required = False

        self.fields['city'].queryset = City.objects.none()
        if 'state' in self.data:
            try:
                state_id = int(self.data.get('state'))
                self.fields['city'].queryset = City.objects.filter(state_id=state_id)
            except (ValueError, TypeError):
                pass 
        elif self.instance.pk:
            self.fields['city'].queryset = self.instance.state.city_set


class HobbyForm(ModelForm):
    class Meta:
        model = Hobby
        fields = ('hobby',)

HobbyFormSet = inlineformset_factory(FamilyHead, Hobby, form=HobbyForm, extra=1)

class FamilyMemberForm(ModelForm):
    class Meta:
        model = FamilyMember
        fields = ['member_name', 'member_dob', 'member_marital', 'member_wedDate', 'education', 'member_photo']
        widgets = {
            "member_dob": forms.DateInput(attrs={"type": "date"}),
            "member_marital": forms.RadioSelect(),
            "member_wedDate": forms.DateInput(attrs={"type": "date"}),
        }

MemberFormset = inlineformset_factory(FamilyHead, FamilyMember, form=FamilyMemberForm, extra=1)