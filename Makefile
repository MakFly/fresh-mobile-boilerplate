SHELL := /bin/zsh
PM ?= bun

.PHONY: help install start ios android web lint typecheck test check doctor build-preview build-production update-preview clean

help:
	@printf "Targets:\n"
	@printf "  make install             Install dependencies with $(PM)\n"
	@printf "  make start               Start Expo\n"
	@printf "  make ios                 Launch Expo for iOS\n"
	@printf "  make android             Launch Expo for Android\n"
	@printf "  make web                 Launch Expo for web\n"
	@printf "  make lint                Run ESLint\n"
	@printf "  make typecheck           Run TypeScript checks\n"
	@printf "  make test                Run Jest\n"
	@printf "  make check               Run lint + typecheck + tests + expo-doctor\n"
	@printf "  make doctor              Run expo-doctor\n"
	@printf "  make build-preview       Trigger an EAS preview build\n"
	@printf "  make build-production    Trigger an EAS production build\n"
	@printf "  make update-preview      Publish a preview OTA update\n"
	@printf "  make clean               Remove Expo and Metro caches\n"
	@printf "\n"
	@printf "Examples:\n"
	@printf "  make start\n"
	@printf "  make install\n"
	@printf "  make lint\n"

install:
	$(PM) install

start:
	$(PM) run start

ios:
	$(PM) run ios

android:
	$(PM) run android

web:
	$(PM) run web

lint:
	$(PM) run lint

typecheck:
	$(PM) run typecheck

test:
	$(PM) run test --runInBand

doctor:
	$(PM) run doctor

build-preview:
	$(PM) run build:preview

build-production:
	$(PM) run build:production

update-preview:
	$(PM) run update:preview

check: lint typecheck test doctor

clean:
	rm -rf .expo
	rm -rf node_modules/.cache
