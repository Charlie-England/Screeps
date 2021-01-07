/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.source');
 * mod.thing == 'a thing'; // true
 */

class RoomSource {
    constructor(sources) {
        this.sources = sources;
        this.assigned = {}; //Object with source.id : [] where the [] is a list of creep.names that are currently working at harvesting this node
        this.allWorkers = [];
        
        for (let src in this.sources) {
            //adds a new key:value to the assigned for each source in the sources list supplied
            const _id = this.sources[src].id;

            this.assigned[_id] = [];
        }
    }
    
    getLowSource(creepName) {
        //checks to see if the worker is already assigned a node (included in allworkers), if so returns -1, if not:
        //returns the source object with the lowest number of workers, if all sources have the same amount of workers returns 0 index
        if (this.allWorkers.includes(creepName)) {
            return -1;
        } else {
            let min = this.assigned[this.sources[0].id];
            let minIndex = 0;
            
            for (let src in this.sources) {
                if (this.assigned[this.sources[src].id] < min) {
                    min = this.assigned[this.sources[0].id];
                    minIndex = src;
                }
            }
            
            return this.sources[minIndex];
        }
    }
    
    getEnergyDict() {
        //returns an object with key value in the form _id:energy
        let energyList = {};
        
        for (let src in this.sources) {
            energyList[this.sources[src].id] = this.sources[src].energy;
        }
        
        return energyList;
    }
    
    
    
    addWorker(creepName) {
        //adds a creepName to the specific _id in the assigned object
        if (this.allWorkers.includes(creepName)) {
            return -1;
        } else {
            let sourceOption = this.getLowSource(creepName);
            
            this.assigned[sourceOption.id].push(creepName);
            this.allWorkers.push(creepName);
            console.log("SOURCE ASSIGNMENT: " + creepName + " to sourceID: " + sourceOption.id);
            
            return (sourceOption.id);
        }
    }
    
    removeWorker(creepName) {
        //creepName, removes from all active sources
        if (this.allWorkers.includes(creepName)) {
            
            try {
                //Find an remove from allWorker List
                let indexWorkerList = this.allWorkers.indexOf(creepName);
                this.allWorkers.splice(indexWorkerList, 1);
                
                //Find in specific 
                for (const src in this.sources) {
                    const _srcID = this.sources[src].id;
                    
                        const index = this.assigned[_srcID].indexOf(creepName);
                        if (index > -1) {
                            this.assigned[_srcID].splice(index, 1);
                            console.log("SOURCE REMOVAL: " + creepName + " from sourceID: " + _srcID);
                        }
                }
            } catch(err) {
                console.log("Unable to remove worker");
            }
        }
    }
}

module.exports = RoomSource;