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

	images := http.FileServer(http.Dir("./src/img"))
	http.Handle("/images/", http.StripPrefix("/images/", images))

	js := http.FileServer(http.Dir("./src/js"))
	http.Handle("/js/", http.StripPrefix("/js/", js))

	css := http.FileServer(http.Dir("./src/styles"))
	http.Handle("/css/", http.StripPrefix("/css/", css))

	fonts := http.FileServer(http.Dir("./src/fonts"))
	http.Handle("/fonts/", http.StripPrefix("/fonts/", fonts))

	assets := http.FileServer(http.Dir("./public"))
	http.Handle("/assets/", http.StripPrefix("/assets/", assets))

	// page routes
	http.HandleFunc("/not-found", func(w http.ResponseWriter, r *http.Request) {
		tpls := template.Must(template.ParseFiles("./templates/404.gohtml"))
		w.WriteHeader(http.StatusNotFound)
		tpls.ExecuteTemplate(w, "404.gohtml", nil)
	})

	http.HandleFunc("/admin", func(w http.ResponseWriter, r *http.Request) {
		tpls := template.Must(template.ParseFiles("./templates/admin.gohtml", "./templates/layouts/base.gohtml"))

		tpls.ExecuteTemplate(w, "base.gohtml", nil)
	})

	http.ListenAndServe(":8080", nil)
}
