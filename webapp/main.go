package main

import (
	"html/template"
	"net/http"
)

func main() {
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {})

	// static files
	fs := http.FileServer(http.Dir("../build/contracts"))
	http.Handle("/abis/", http.StripPrefix("/abis/", fs))

	vue := http.FileServer(http.Dir("./public"))
	http.Handle("/assets/", http.StripPrefix("/assets/", vue))

	// page routes
	http.HandleFunc("/not-found", func(w http.ResponseWriter, r *http.Request) {
		tpls := template.Must(template.ParseFiles("./templates/404.gohtml"))
		w.WriteHeader(http.StatusNotFound)
		tpls.ExecuteTemplate(w, "404.gohtml", nil)
	})

	http.HandleFunc("/admin", func(w http.ResponseWriter, r *http.Request) {
		tpls := template.Must(template.ParseFiles("./templates/admin.gohtml", "./templates/layouts/main.gohtml"))

		tpls.ExecuteTemplate(w, "main.gohtml", nil)
	})

	http.ListenAndServe(":8080", nil)
}
