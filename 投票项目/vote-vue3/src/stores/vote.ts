import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
type userInfo = {
  code:number,
  result:{
    avatar:string,
    name:string,
    userId:number | string
  }
}
export const useVoteStore = defineStore('vote', () => {
  const user = ref<null | userInfo>(null)
  async function getUserInfo(){
    try{
      let userInfo = await fetch('/api/account/current-user').then(res=>res.json())
      user.value = userInfo
    }catch(err){
      console.log('No user logged in')
    }
  }

  return { user, getUserInfo }
})
