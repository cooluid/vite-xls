import {defineStore} from "pinia";

export const useFileStore = defineStore('file', {
	state: () => ({
		names: "",
	}),

	actions: {
		setNames(names: string) {
			this.names = names;
			localStorage.setItem("names", names);
		},
		getNames() {
			this.names = localStorage.getItem("names") || "";
			return this.names;
		},

		clearAllNames() {
			this.names = "";
			localStorage.clear();
			console.log("clearAllNames");
		}
	},
})