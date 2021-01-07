let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let RoomSource = require('room.source');


let rs = new RoomSource(Game.rooms['W2N5'].find(FIND_SOURCES));

let rolesNum = { 'builder':3, 'harvester':2, 'upgrader':6 };

module.exports.loop = function() {
    /*      create/replenish creep code     */
    
    //Clear memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            rs.removeWorker(name);
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    

    
    //iterate through rolesNum object and verify there are the number of creeps for each, spawn another if not
    for (let role in rolesNum) {
        let energyAvail = Game.rooms['W2N5'].energyAvailable;
        
        let curNumRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        
        if (curNumRole.length < rolesNum[role] && !Game.spawns['Spawn1'].spawning && energyAvail > 199) { //check to see if the currently alive creeps per role is less than the max
            //Create new name of creep
            let newName = role + Game.time;
            
            console.log('Spawning new ' + role + ' ' + newName);
            
            //Create/modify bodyparts list based on available resources
            let bodyParts = [WORK, CARRY, MOVE];
            energyAvail-=200;
            while (energyAvail > 49) {
                switch(role) {
                case 'harvester':
                    if (energyAvail-100 > 0) {
                        bodyParts.push(WORK);
                        energyAvail-=100;
                    } else {
                        bodyParts.push(MOVE)
                        energyAvail-=50;
                    }
                    break;
                case 'upgrader':
                    if (energyAvail-150 > 0) {
                        bodyParts.push(WORK);
                        bodyParts.push(CARRY);
                        energyAvail-=150;
                    } else if (energyAvail-100 > 0) {
                        bodyParts.push(MOVE);
                        bodyParts.push(CARRY);
                        energyAvail-=100;
                    } else {
                        bodyParts.push(CARRY);
                        energyAvail-=50;
                    }
                    break;
                case 'builder':
                    if (energyAvail-100 > 0) {
                        bodyParts.push(MOVE);
                        bodyParts.push(CARRY);
                        energyAvail-=100;
                    } else {
                        bodyParts.push(CARRY);
                        energyAvail-=50;
                    }
                    break;
                }
            }
            
            //Spawn creep w/ a specific role
            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
            {memory: {role: role}});
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    /*     Tower Defense Code   */
    
    
    //Give assignments to creeps based on memory.role
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep, rs);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, rs);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep, rs);
        }
    }
}