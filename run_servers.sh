#!/bin/bash
killall node
cd backend && node server.js &
cd frontend-web && npm run dev &
cd frontend-admin && npm run dev &