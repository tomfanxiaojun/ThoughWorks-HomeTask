var Agents = (function() {
    var agents = {};
    agents.userId = window.uid || 1;
    agents.userName = 'Master';
    agents.types = ['All', 'Physical', 'Virtual']
    agents.activeTypes = agents.types[0];
    agents.agents = [];
    var status = ['idle', 'building'];
    initAgents(20);

    function initAgents(agentsCount) {
        for (var i = 0; i < agentsCount; i++) {
            var agent = {};
            agent.id = (i + 1);
            if (Math.floor(Math.random() * 10) % 2 == 0) {
                agent.type = agents.types[1];
            } else {
                agent.type = agents.types[2];
            }

            agent.email = 'bjstdmngbgr0' + i + '.thoughworks.com';
            if (Math.floor(Math.random() * 10) % 2 == 0) {
                agent.status = status[0];
            } else {
                agent.status = status[1];
            }
            agent.ip = '192.168.1.' + (i + 1);
            agent.path = '/var/lib/cruise-agent';
            agent.resources = [];
            var sourcesCount = Math.floor(Math.random() * 10) - 5;
            sourcesCount = sourcesCount < 0 ? 0 : sourcesCount;
            for (var j = 0; j < sourcesCount; j++) {
                var source = {};
                source.id = j + 1;
                source.agentId = agent.id;
                source.name = "source-" + (j + 1);
                agent.resources.push(source);
            }

            agents.agents.push(agent);

        }
    }

    agents.statusCount = function(type) {
        var statusCount = {}
        statusCount[status[0]] = 0;
        statusCount[status[1]] = 0;
        agents.agents.forEach(function(e, index) {
            if (e.type == type || type == 'All') {
                statusCount[e.status]++;
            }
        });
        return statusCount;
    }
    agents.deleteResources = function(agentid, id, fb) {
        agents.agents.forEach(function(a, ai) {
            if (a.id == agentid) {
                a.resources.forEach(function(r, ri) {
                    if (r.id == id) {
                        a.resources.splice(ri, 1)
                    }
                });
            }
        });
        fb(agentid, id);
    }
    agents.addResources = function(agentid, resourcesArr, fb) {
        var result = [];
        agents.agents.forEach(function(a, ai) {
            if (a.id == agentid) {
                var maxId = 1;
                a.resources.forEach(function(r, ri) {
                    if (r.id > maxId) {
                        maxId = r.id;
                    }
                });
                resourcesArr.forEach(function(r, index) {
                    if (r) {
                        var source = {};
                        source.id = maxId + 1;
                        source.agentId = agentid;
                        source.name = r;
                        maxId++;
                        a.resources.push(source);
                        result.push(source);
                    }

                });

            }
        });
        fb(agentid, result);
    }
    agents.historys = [];
    initHistorys(10);

    function initHistorys(historyCount) {
        for (var i = 0; i < historyCount; i++) {
            agents.historys.push('bjstdmngdgr0' + (i + 1) + '/Acceptance_test')
        }
    }

    return agents;
})()
