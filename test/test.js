describe("Pkgify", function () {

  describe("when a directory is specified", function () {

    it("should map the whole directory as the package");

  });

  describe("when a single file is specified", function () {

    it("should map the individual file as the package");

  });

  describe("when relativeTo is specified", function () {

    it("should map relative to relativeTo");

  });

  describe("when relativeTo is not specified", function () {

    it("should map relative to process.cwd()");

  });

  describe("when resolving multiple matches", function () {

    it("should prioritise last match");

    it("should prioritise file type over directory type");

    it("should prioritise deepest match");

  });

});