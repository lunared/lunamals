const UseItem = {
    path: "/use",
    method: "POST",
    schema: {
        body: [
            {type: "number", name: "index"},
            {type: "number", name: "action"},
            {type: "string", name: "target"},
        ]
    },
    async handler(req, res) {
        const { 
            body: { index, action, target }, 
            jwt: { id: userId, },
            $storage, 
            $vm
        } = req;

        const item = await $storage.inventory.fetch(index);

        if (action === 'store') {
            await $storage.deposit.store(item);
            return {};
        }
        else if (action === 'shop') {
            // if shop capacity is already max, this will return an error
            await $storage.shop.listItem(item);
            return {};
        }
        else if (!(action in item.actions)) {
            res.code(406);
            req.log.error("Invalid action used on item");
            return {};
        }

        // all other commands should have a target that may be affected
        const pet = await $storage.pets.fetch(target)
        if (pet.owner !== userId) {
            res.code(403);
            req.log.error("Pet does not belong to owner, interactions are not allowed.");
            return {};
        }
    
        let command = item.actions[action];
        if (action === 'consume') {
            await $services.pets.feed(pet, command.hunger);
        }
        else if (action === 'play') {
            await $services.pets.play(pet, command.joy);
        }

        if ('after' in command) {
            command.after.forEach(script => {
                $vm.exec(script, {res});
            });
        }
        return {};
    }
}
