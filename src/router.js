import Home from './views/Home.vue';
import WishForm from './views/WishForm.vue';
import Developers from './views/Developers.vue';
import WishView from './views/WishView.vue';

export const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/submit-wish', component: WishForm, name: 'submit-wish' },
    { path: '/developers', component: Developers, name: 'developers' },
    { path: '/wish/:id', component: WishView, name: 'wish-view' } 
];
