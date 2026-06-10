import type { Toast } from "@nuxt/ui/composables"

type Modal = {
   show: boolean
   title: string
   component: VNode | null
   width?:
      | "auto"
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "7xl"
      | "8xl"
}

export const useAppStore = defineStore("app-store", () => {
   const modal = ref<Modal>({
      show: false,
      component: null,
      title: "",
      width: "lg",
   })

   function openModal(
      title: Modal["title"],
      component: Modal["component"],
      opts?: Partial<Omit<Modal, "show" | "title" | "component">>
   ) {
      modal.value.component = component
      modal.value.title = title
      modal.value.show = true
      modal.value.width = opts?.width ?? "lg"
   }

   function closeModal() {
      modal.value.show = false
      setTimeout(() => {
         modal.value.component = null
         modal.value.title = ""
         modal.value.width = "lg"
      }, 100)
   }

   function notify(opts: Partial<Toast>) {
      const toast = useToast()
      toast.add(opts)
   }

   return {
      modal,
      openModal,
      closeModal,
      notify,
   }
})
