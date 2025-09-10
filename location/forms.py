from django import forms
from django.forms import ModelForm
from family.models import State, City, statusChoice

class StateForm(ModelForm):
    class Meta:
        model = State
        fields = "__all__"
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['status'].required = False
        self.fields['status'].choices = [
            (statusChoice.ACTIVE, 'Active'),
            (statusChoice.INACTIVE, 'Inactive'),
        ]

    def clean(self):
        super().clean()
        # state name
        id = self.cleaned_data.get('pk')
        state_name = self.cleaned_data.get('state_name')
        if not state_name: 
            self.add_error('state_name','State is required.')
        elif State.objects.exclude(status=statusChoice.DELETE).filter(state_name=state_name).exclude(pk=self.instance.pk).exists():
            self.add_error('state_name','State already exists.')