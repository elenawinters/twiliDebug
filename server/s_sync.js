

onNet('twiliDebug:deleteEntity:_sync', (entity, owner, remote) => {
    console.log(`deleteEntity:_sync: forcing ${GetPlayerName(owner)} to delete ${entity}`);
    emitNet('twiliDebug:deleteEntity', owner, entity, remote);
})