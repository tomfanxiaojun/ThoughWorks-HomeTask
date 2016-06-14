var UserAgents = (function() {
    function UserAgents(uid) {
        return UserAgents.prototype.init.call(this, uid);
    }
    UserAgents.prototype = {
        constructor: UserAgents,
        userId: 0,
        userName: "",
        types: ['All', 'Physical', 'Virtual'],
        activeTypes: '',
        status: ['idle', 'building'],
        agents: [],
        historys: [],
        init: function(uid) {
            var User = getUser(uid);
            if (User) {
                this.userId = User.userId;
                this.userName = User.userName;
            } else {
                this.userId = 0;
                this.userName = 'Not Login';
            }
            this.activeTypes = this.types[0];
            initAgents.call(this, 20);
            initHistorys.call(this, 10);
            return this;
        },
        statusCount: function(type) {
            var statusCount = {}
            statusCount[this.status[0]] = 0;
            statusCount[this.status[1]] = 0;
            this.agents.forEach(function(e, index) {
                if (e.type == type || type == 'All') {
                    statusCount[e.status]++;
                }
            });
            return statusCount;
        },
        getAgentsByType: function(type) {
            if (type == 'All') {
                return this.agents;
            } else {
                var result = [];
                this.agents.forEach(function(e, index) {
                    if (e.type == type) {
                        result.push(e);
                    }
                });
                return result;
            }
        },
        deleteResources: function(agentid, id, fb) {
            this.agents.forEach(function(a, ai) {
                if (a.id == agentid) {
                    a.resources.forEach(function(r, ri) {
                        if (r.id == id) {
                            a.resources.splice(ri, 1)
                        }
                    });
                }
            });
            fb(agentid, id);
        },
        addResources: function(agentid, resourcesArr, fb) {
            var result = [];
            this.agents.forEach(function(a, ai) {
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
    }

    function initHistorys(historyCount) {
        for (var i = 0; i < historyCount; i++) {
            this.historys.push('bjstdmngdgr0' + (i + 1) + '/Acceptance_test')
        }
    }

    function initAgents(agentsCount) {
        for (var i = 0; i < agentsCount; i++) {
            var agent = {};
            agent.id = (i + 1);
            if (Math.floor(Math.random() * 10) % 2 == 0) {
                agent.type = this.types[1];
            } else {
                agent.type = this.types[2];
            }

            agent.email = 'bjstdmngbgr0' + i + '.thoughworks.com';
            if (Math.floor(Math.random() * 10) % 2 == 0) {
                agent.status = this.status[0];
            } else {
                agent.status = this.status[1];
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

            this.agents.push(agent);

        }
    }

    function getUser(uid) {
        var usersList = [
            { userId: 1, userName: 'Master' },
            { userId: 2, userName: 'Admin' },
            { userId: 3, userName: 'Guest' }
        ]
        var targetUser = usersList.filter(function(e) {
            return e.userId == uid;
        })
        return targetUser?targetUser[0]:undefined;
    }
    return UserAgents;
})()
