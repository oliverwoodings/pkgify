BIN = ./node_modules/.bin

.PHONY: bootstrap test

SRC = $(shell find ./lib ./test -type f -name '*.js')

bootstrap:
	npm install;

test:
	@$(BIN)/jscs $(SRC);
	@$(BIN)/jshint $(SRC);
	@$(BIN)/mocha ./test/test.js