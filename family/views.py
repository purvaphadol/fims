from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import JsonResponse
from .forms import FamilyHeadForm, HobbyFormSet, MemberFormset
from .models import FamilyHead, FamilyMember, Hobby, City

from django.http import FileResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

# Create your views here.
def home(request):
    return render(request, 'index.html')

def get_cities(request, state_id):
    # state_id = request.GET.get('state_id')
    cities = City.objects.filter(state_id=state_id).all()
    data = list(cities.values('id', 'city_name'))
    return JsonResponse(data, safe=False)

def family_form(request):
    head_form = FamilyHeadForm()
    hobby_formset = HobbyFormSet(prefix="hobbies")
    member_formset = MemberFormset(prefix="members")
    if request.method == 'POST':
        head_form = FamilyHeadForm(request.POST, request.FILES)
        hobby_formset = HobbyFormSet(request.POST, instance=head_form.instance, prefix="hobbies")
        member_formset = MemberFormset(request.POST, request.FILES, instance=head_form.instance, prefix="members")
        if head_form.is_valid() and hobby_formset.is_valid() and member_formset.is_valid():
            head = head_form.save()
            hobby_formset.instance = head
            hobby_formset.save()
            member_formset.instance = head
            member_formset.save()
            return JsonResponse({"success": True})
        else:
            return JsonResponse({
                "success": False,
                "head_errors": head_form.errors,
                "hobby_errors": hobby_formset.errors,
                "member_errors": member_formset.errors,
            }, status=400)
    # for GET requests
    context = {
        'head_form': head_form,
        'hobby_formset': hobby_formset,
        'member_formset': member_formset
    }
    return render(request, 'family_form.html', context)

def family_pdf(request, pk):
    head = FamilyHead.objects.get(pk=pk)
    members = FamilyMember.objects.filter(family_head=head)
    hobbies = Hobby.objects.filter(family_head=head)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{head.name}_family.pdf"'

    doc = SimpleDocTemplate(response)
    styles = getSampleStyleSheet()
    elements = []
    
    elements.append(Paragraph(f"Family Report: {head.surname} Family", styles['Heading1']))

    # Head details
    elements.append(Paragraph("Head Details", styles['Heading2']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Name: {head.name}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Surname: {head.surname}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Birth Date: {head.dob}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Mobile: {head.mobno}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Address: {head.address}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"State: {head.state.state_name}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"City: {head.city.city_name}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Pincode: {head.pincode}", styles['Normal']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(f"Marital Status: {head.marital_status}", styles['Normal']))
    elements.append(Spacer(1, 4))

    elements.append(Paragraph(f"Wedding Date: {head.wedding_date}", styles['Normal']))
    elements.append(Spacer(1, 4))

    img_path = f"home/dev82/Documents/Project/fims/static/pictures/{head.photo}"
    try:
        img = Image(img_path, width=4*inch, height=3*inch) # Adjust width and height as needed
        elements.append(Paragraph(f"Photo:", styles['Normal']))
        elements.append(img)
    except Exception as e:
        elements.append(Paragraph(f"Photo: {head.photo}", styles['Normal']))
    elements.append(Spacer(1, 12))

    # Hobbies
    elements.append(Paragraph("Hobbies", styles['Heading3']))
    count=1
    for h in hobbies:
        elements.append(Paragraph(f"{count}. {h.hobby}", styles['Normal']))
        elements.append(Spacer(1, 4))

        count += 1
    elements.append(Spacer(1, 12))

    # Members
    elements.append(Paragraph("Members", styles['Heading2']))
    count = 1
    for m in members:
        elements.append(Paragraph(f"Member {count}", styles['Heading3']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Name: {m.member_name}", styles['Normal']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Birth Date: {m.member_dob}", styles['Normal']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Marital Status: {m.member_marital}", styles['Normal']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Wedding Date: {m.member_wedDate}", styles['Normal']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Education: {m.education}", styles['Normal']))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Photo: {m.member_photo}", styles['Normal']))
  
        elements.append(Spacer(1, 12))
        count += 1

    doc.build(elements)
    return response