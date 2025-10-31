import { useRoute,useRouter } from 'vue-router'
import { useVoteStore } from '@/stores/vote'


export function useLogin(){
  let voteStore = useVoteStore()
  let router = useRouter()
  let route = useRoute()
  if(voteStore.user === null || (voteStore.user as any).code === -1){
    router.replace(`/login?next=${route.fullPath}`)
    return false
  }
  return true
}