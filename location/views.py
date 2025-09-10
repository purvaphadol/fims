from django.shortcuts import render, redirect
from family.models import State, City, statusChoice
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .forms import StateForm
# Create your views here.

def state_list(request):
    states = State.objects.all()
    p = Paginator(states, 10)  
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    totalPages = page_obj.paginator.num_pages
    context = {
        'page_obj': page_obj,
        'lastPage': totalPages,
        'totalPagelist': [n+1 for n in range(totalPages)],
    }
    return render(request, 'state_list.html', context)

def create_state(request):
    state_form = StateForm()
    if request.method == 'POST':
        state_form = StateForm(request.POST)
        if state_form.is_valid():
            state_form.save()
            return redirect('state_list')
    context = {'state_form': state_form }
    return render(request, 'create_state.html', context)

def update_state(request, pk):
    state = State.objects.get(id=pk)
    state_form = StateForm(instance=state)
    print(state_form)
    if request.method == 'POST':
        state_form = StateForm(request.POST, instance=state)
        print(state_form)
        if state_form.is_valid():
            state_form.save()
            return redirect('state_list')
    context = {'state_form': state_form }
    return render(request, 'update_state.html', context)

def delete_state(request, pk):
    state = State.objects.get(id=pk)
    if request.method == 'POST':
        state.status = statusChoice.DELETE
        state.save()
        City.objects.filter(state_id=state).update(status = statusChoice.DELETE)
        return redirect('state_list')
    context = {'state':state}
    return render(request, 'delete_state.html', context)