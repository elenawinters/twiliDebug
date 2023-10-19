// let IsbonesRendering = false

// RegisterCommand('vehbones', (source, args) => {
//     IsbonesRendering = !IsbonesRendering;
//     if (!IsbonesRendering) { return; }
//     const thread = setTick(() => {
//         if (!IsbonesRendering) { clearTick(thread); return; }
//         entity = GetVehiclePedIsIn(PLAYER_PED(), false)
//         Object.values(vehicleBones).forEach((boneName) => {
//             boneIndex = GetEntityBoneIndexByName(entity, boneName)
//             if (boneIndex != -1) {
//                 console.log(boneIndex)
//                 pos = GetWorldPositionOfEntityBone(entity, boneIndex)
//                 console.log(pos)
//                 DrawSphere(pos[0], pos[1], pos[2], 0.1, 94, 3, 252, 1)
//             }

//         })
//     })
// })



RegisterCommand('vehbones', (source, args) => {
    Object.values(vehicleBones).forEach((boneName) => {
        boneIndex = GetEntityBoneIndexByName(GetVehiclePedIsIn(PLAYER_PED(), false), boneName)
        if (boneIndex != -1) {
            console.log(`${boneName} is a valid bone`)
        }
    })
})