/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

let roleBuilder = {
    run: function(creep, rs) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('--Harvesting--');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            rs.removeWorker(creep.name);
            creep.memory.harvestNode = -1;
            creep.say('--Building--')
        }
        
        if (creep.memory.building) {
            let buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            let repairTargets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                return (structure.hits < structure.hitsMax); }
            });
            
            if (buildTargets.length > 0) { //Build first
                if (creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (repairTargets.length > 0) { //If nothing to build, repair next
                if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else { //If nothing to build or repair, move to idle area
                creep.moveTo(5,40);
            }
        } else { //if not building, harvest energy
        
        
            /*
            harvest source energy code
            uses the roomSource class to keep track of which creeps are at which source to avoid issues with ineffecient assignment
            */
            
            //Call addWorker with the current creep.name and return -1 or the source.id
            let hNode = rs.addWorker(creep.name);
            if (hNode > -1) {
                creep.memory.harvestNode = hNode;
            }
            
            //If the memory is undefined or -1 at this point, it needs a source to harvest:
            //Call removeWorker to fully remove them from the rs object, add worker back in and assign returned source.id to memory
            if (creep.memory.harvestNode == undefined || creep.memory.harvestNode == -1) {
                rs.removeWorker(creep.name);
                creep.memory.harvestNode = rs.addWorker(creep.name);
            }

            //Move to selected source mode
            if (creep.harvest(Game.getObjectById(creep.memory.harvestNode)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.harvestNode), {visualizePathStyle: {stroke: '#ffaa00'}});
            }

        }
    }
}

module.exports = roleBuilder;