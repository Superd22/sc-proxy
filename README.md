# sc-proxy
TCP proxy for reverse engineering star citizen.

This is **very** WIP. Currently only supports TCP and tested in menus

## What this does so far
- hits `public.universe.robertsspaceindustries.com` with an A DNS lookup to know which "universe" IP it has to connect to (on launch)
- creates a Fake DNS server for the game to connect to, redirecting to 127.0.0.1
- spools up a proxy between the game client & server
- display incoming/outgoing tcp as hex

## To-do list
- [ ] Decode packets
- [ ] Figure out TLS for sending RPC calls


(only runs on windows, manually change your hosts if want to run on another platform)
