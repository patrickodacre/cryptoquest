package main

import (
	"html/template"
	"net/http"

	"github.com/go-chi/chi"
)

func main() {
	r := chi.NewRouter()

	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {})

	// static files
	contracts := http.FileServer(http.Dir("../build/contracts"))
	r.Get("/abis/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/abis/", contracts).ServeHTTP(w, r)
	})

	images := http.FileServer(http.Dir("./src/img"))
	r.Get("/images/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/images/", images).ServeHTTP(w, r)
	})

	js := http.FileServer(http.Dir("./src/js"))
	r.Get("/js/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/js/", js).ServeHTTP(w, r)
	})

	css := http.FileServer(http.Dir("./src/styles"))
	r.Get("/css/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/css/", css).ServeHTTP(w, r)
	})

	fonts := http.FileServer(http.Dir("./src/fonts"))
	r.Get("/fonts/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/fonts/", fonts).ServeHTTP(w, r)
	})

	assets := http.FileServer(http.Dir("./public"))
	r.Get("/assets/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/assets/", assets).ServeHTTP(w, r)
	})

	// page routes
	http.HandleFunc("/not-found", func(w http.ResponseWriter, r *http.Request) {
		tpls := template.Must(template.ParseFiles("./templates/404.gohtml"))
		w.WriteHeader(http.StatusNotFound)
		tpls.ExecuteTemplate(w, "404.gohtml", nil)
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		tpls := template.Must(template.ParseFiles("./templates/home.gohtml", "./templates/layouts/base.gohtml"))

		tpls.ExecuteTemplate(w, "base.gohtml", nil)
	})
	r.Get("/admin", func(w http.ResponseWriter, r *http.Request) {
		tpls := template.Must(template.ParseFiles("./templates/admin.gohtml", "./templates/layouts/base.gohtml"))

		tpls.ExecuteTemplate(w, "base.gohtml", nil)
	})

	r.Get("/admin/zones/{zoneID}", func(w http.ResponseWriter, r *http.Request) {
		zoneID := chi.URLParam(r, "zoneID")

		tpls := template.Must(template.ParseFiles("./templates/zone.gohtml", "./templates/layouts/base.gohtml"))

		tpls.ExecuteTemplate(w, "base.gohtml", zoneID)
	})

	r.Get("/adventure/{zoneID}", func(w http.ResponseWriter, r *http.Request) {
		zoneID := chi.URLParam(r, "zoneID")

		tpls := template.Must(template.ParseFiles("./templates/adventure/zone.gohtml", "./templates/layouts/base.gohtml"))

		tpls.ExecuteTemplate(w, "base.gohtml", zoneID)
	})

	http.ListenAndServe(":8080", r)
}
