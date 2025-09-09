from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from family.models import FamilyMember, FamilyHead, State, City
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from family.forms import *

# Create your views here.
@login_required(login_url='login_page')
def dashboard(request):
    heads = FamilyHead.objects.all()
    members = FamilyMember.objects.all()
    states = State.objects.all()
    cities = City.objects.all()
    context = {
        'members': members,
        'heads': heads,
        'states': states,
        'cities': cities,
    }
    return render(request, 'dashboard.html', context)

def family_list(request):
    heads = FamilyHead.objects.all()
    members = FamilyMember.objects.all()
    p = Paginator(heads, 5)  # creating a paginator object
    # getting the desired page number from url
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    totalPages = page_obj.paginator.num_pages
    context = {
        'members': members,
        'page_obj': page_obj,
        'lastPage': totalPages,
        'totalPagelist': [n+1 for n in range(totalPages)],
    }
    return render(request, 'family_list.html', context)

def view_family(request, pk):
    head = FamilyHead.objects.get(id=pk)
    members = FamilyMember.objects.filter(family_head_id=pk).all()
    hobbies = Hobby.objects.filter(family_head_id=pk).all()
    
    context = {
        'head': head,
        'members': members,
        'hobbies': hobbies
    }
    return render(request, 'view_family.html', context)

def update_family(request, pk):
    head = FamilyHead.objects.get(id=pk)
    head_form = FamilyHeadForm(instance=head)
    # hobby = Hobby.objects.filter(family_head_id=pk).all()
    hobby_formset = HobbyFormSet(instance=head, prefix="hobbies")
    member_formset = MemberFormset(prefix="members", instance=head)
    if request.method == 'POST':
        head_form = FamilyHeadForm(request.POST, request.FILES, instance=head)
        hobby_formset = HobbyFormSet(request.POST, instance=head, prefix="hobbies")
        member_formset = MemberFormset(request.POST, request.FILES, instance=head.instance, prefix="members")
        if head_form.is_valid() and hobby_formset.is_valid() and member_formset.is_valid():
            print(hiii)
            # head_form.save()
            h = head_form.save()
            hobby_formset.instance = h
            hobby_formset.save()
            member_formset.instance = h
            member_formset.save()
            return JsonResponse({"success": True})
        else:
            print(head_form.errors)
            return JsonResponse({
                "success": False,
                "head_errors": head_form.errors,
            })
    # else:
    #     head_form = FamilyHeadForm(instance=head)
    context = {
        'head_form': head_form,
        'hobby_formset': hobby_formset,
        'member_formset': member_formset
    }
    return render(request, 'update_family.html', context)

def delete_family(request, pk):
    return render(request, 'delete_family.html')
