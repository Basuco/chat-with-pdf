<script>
    import { Alert } from 'flowbite-svelte';
    import { APP_STATUS, appStatus } from '../store.ts';
    import StepChat from './StepChat.svelte';
    import StepLoading from './StepLoading.svelte';
    import StepUpload from './StepUpload.svelte';
</script>

<!-- $ for the store values because you have to subscribe to the variable, just suggar sintax -->
{#if $appStatus === APP_STATUS.INIT}
    <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
    <StepLoading />
{:else if $appStatus === APP_STATUS.CHAT_MODE}
    <StepChat />
{:else if $appStatus === APP_STATUS.ERROR}
    <Alert>
        <span class="font-medium">Something went wrong!</span>
        There is an error with the app
    </Alert>
{:else}
    <Alert>
        <span class="font-medium">Unknown action</span>
        This state of the app is Unknown
    </Alert>
{/if}