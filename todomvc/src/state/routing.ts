import { update, FilterType } from '../state';


function handleHashChange () {
  const newHash = window.location.hash.split('#')[1];
  let filterType: FilterType = 'All';
  if (newHash === 'Completed') {
    filterType = 'Completed';
  } else if (newHash === 'Active') {
    filterType = 'Active';
  }

  update((s) => { 
    s.filter = filterType;
  });
}

window.addEventListener('hashchange', handleHashChange);