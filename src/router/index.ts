import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../views/Inicio.vue";
import { atualizarMetaDescription } from "../utils/dom";
import MeAjude from "../views/MeAjude.vue";

const Socorrer = () => import("../views/Socorrer.vue")

const router = createRouter({
	history: createWebHistory(),
	routes : [
		{
			path     : "/",
			name     : "inicio",
			component: Inicio,
			meta     : {
				title: "Início",
			}
		},
		{
			path     : "/me-ajude",
			name     : "me-ajude",
			component: MeAjude,
			meta     : {
				title: "Me ajude",
			}
		},
		{
			path     : "/socorrer",
			name     : "socorrer",
			component: Socorrer,
			meta     : {
				title: "Socorrer",
			}
		},
	]
});

router.beforeEach((to, from, next) => {

	// @ts-ignore
	document.title = "SOS" + (to.meta?.title ? " | " + to.meta.title : "");

	atualizarMetaDescription(
		to.meta?.description as string ??
		"Sistema para solicitação de resgate de vítimas de desastres naturais."
	);

	next();
});

export default router;
