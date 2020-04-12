package main

import (
	"log"

	"github.com/sno6/chess-tournament/backend/hub"
)

const defaultAddr string = ":8080"

func main() {
	log.Printf("Hub starting at %q\n", defaultAddr)

	err := (hub.New(&hub.Config{Addr: defaultAddr}).Start())
	if err != nil {
		log.Fatalf("Error initialising connection hub: %v\n", err)
	}
}
