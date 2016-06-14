/*
toBe()
toNotBe()
toBeDefined()
toBeUndefined()
toBeNull()
toBeTruthy()
toBeFalsy()
toBeLessThan()
toBeGreaterThan()
toEqual()
toNotEqual()
toContain()
toBeCloseTo()
toHaveBeenCalled()
toHaveBeenCalledWith()
toMatch()
toNotMatch()
toThrow()
*/
describe("Test case for AngentsObj file", function() {
    var Agents = new UserAgents(1);
    describe("Agents Base info test ", function() {
        it("User Name is equal master", function() {
            expect(Agents.userName).toBe('Master');
        });
    });
    describe("Test for statusCount function ", function() {
        var expectResult = {};
        Agents.agents.forEach(function(e, index) {
            if (expectResult[e.type]) {
                if (expectResult[e.type][e.status]) {
                    expectResult[e.type][e.status] = expectResult[e.type][e.status] + 1;
                } else {
                    expectResult[e.type][e.status] = 1;
                }

            } else {
                expectResult[e.type] = {};
                expectResult[e.type][e.status] = 1;
            }
        });
        Agents.types.forEach(function(e, index) {
            it("test status for " + e + " ", function() {
                var actualResult = Agents.statusCount(e);
                if (e == 'All') {
                    var tempAll = {};
                    for (var type in expectResult) {
                        for (var status in expectResult[type]) {
                            if (tempAll[status]) {
                                tempAll[status] = tempAll[status] + expectResult[type][status];
                            } else {
                                tempAll[status] = expectResult[type][status];
                            }
                        }
                    }
                    for (var status in tempAll) {
                        expect(tempAll[status]).toEqual(actualResult[status]);
                    }
                } else {
                    for (var status in expectResult[e]) {
                        expect(expectResult[e][status]).toEqual(actualResult[status]);
                    }
                }

            });
        });


    });
    describe("Test for addResources function ", function() {
        it("Add resources ", function() {
            if (Agents.agents.length > 0) {
                var agent = Agents.agents[0];
                var beforCount = agent.resources.length;
                var resources = ['1', '2'];
                Agents.addResources(agent.id, resources, function() {
                    var afterAgent = Agents.agents[0];
                    var afterCount = afterAgent.resources.length;
                    expect(beforCount + resources.length).toEqual(afterCount);
                    var resourcesNames = [];
                    afterAgent.resources.forEach(function(r, index) {
                        resourcesNames.push(r.name)
                    });
                    resources.forEach(function(r, index) {
                        expect(resourcesNames.indexOf(r)).toBeGreaterThan(-1);
                    });


                })

            }
        });
    });
    describe("Test deleteResources function", function() {
        it("Test remove resources function", function() {
            var targetAgent;
            Agents.agents.forEach(function(e, index) {
                if (e.resources.length > 0) {
                    targetAgent = e;
                }
            });
            var beforeCount = targetAgent.resources.length;
            var targetResource = targetAgent.resources[0];
            Agents.deleteResources(targetAgent.id, targetResource.id, function() {
                var afterAgent;
                Agents.agents.forEach(function(e, index) {
                    if (e.id == targetAgent.id) {
                        afterAgent = e;
                    }
                });
                var afterCount = afterAgent.resources.length;
                expect(beforeCount - 1).toEqual(afterCount);
                var tempIds = [];
                afterAgent.resources.forEach(function(e) {
                    tempIds.push(e.id);
                });
                expect(tempIds.indexOf(targetResource.id)).toBeLessThan(0);
            })
        });
    });
});
