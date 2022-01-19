class EventBus {
    constructor(){
        
    }
    handlerBus={}

    $on(eventName,handler){
        if(!this.handlerBus.hasOwnProperty(eventName)){
            this.handlerBus[eventName] = []
        }
        this.handlerBus[eventName].push(handler)
    }

    $emit(eventName,handlerParams){
        if(!this.handlerBus.hasOwnProperty(eventName)){
            return new Error('未注册该事件')
        }
        const eventHandlers = this.handlerBus[eventName]
        for(let i = 0;i<eventHandlers.length;i++){
            eventHandlers[i](handlerParams)
        }
    }
    $once(eventName,handlerParams){
        this.$emit(eventName,handlerParams)
        this.$remove(eventName)
    }
    $remove(eventName,handler){
        if(!this.handlerBus.hasOwnProperty(eventName)){
            return new Error('未注册该事件')
        }
        if(!handler){
            //如果没指定移除的子handler 则移除整个eventName
            Reflect.defineProperty(this.handlerBus,eventName)
            return
        }
        //如果指定了handler
        const eventHandlers = this.handlerBus[eventName]
        const handlerIndex = eventHandlers.findIndex(event=>event === handler)
        if(handlerIndex === -1){
            return new Error('未绑定该事件')
        }
        this.handlerBus[eventName].splice(handlerIndex,1)
        if(this.handlerBus[eventName].length === 0)Reflect.defineProperty(this.handlerBus,eventName)
    }
}
export default EventBus