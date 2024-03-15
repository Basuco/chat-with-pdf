<script>
    import { Input, Label, Spinner } from 'flowbite-svelte';
    import { appStatusInfo, setAppStatusError } from '../store';
    const { id, url, pages } = $appStatusInfo;

    let answer = '';
    let loading = false;
    let question = '';

    const numOfImagesToShow = Math.min(pages, 4);
    const images = Array.from({length: numOfImagesToShow}, (_, i) => {
        const page = i + 1;
        return url
            .replace('/upload/', `/upload/w_400,h_540,c_fill,pg_${page}/`)
            .replace('.pdf', '.jpg');
    });

    const handleSubmit = async(event) => {
        event.preventDefault();
        loading = true;
        answer = '';
        // const question = event.target.question.value;
        const searchParams = new URLSearchParams();
        searchParams.append('id', id);
        searchParams.append('question', question);
        // try {
        //     const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`);
        //     eventSource.onmessage = (event) => {
        //         loading = false;
        //         const incomingData = JSON.parse(event.data);

        //         if (incomingData === '__END__') {
        //             eventSource.close();
        //             return;
        //         }
        //         answer += incomingData;
        //     }
        // } catch (e) {
        //     console.error(e);
        //     setAppStatusError();
        // } finally {
        //     loading = false;
        // }

        try {
            const res = await fetch(`/api/ask?${searchParams.toString()}`, {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error('Error asking question');
                return;
            }

            const { response } = await res.json();
            answer = response;
        } catch (e) {
            console.error(e);
            setAppStatusError();
        } finally {
            loading = false;
        }
    }
</script>
<div class="grid grid-cols-4 gap-2">
    {#each images as image}
        <img src={image} alt="PDF page" class="w-full h-auto rounded aspect-[400/540]"/>
    {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
    <Label for="question" class="block mb-2">Ask something</Label>
    <Input for="question" bind:value={question} required placeholder="What is this document for?"></Input>
</form>

{#if loading}
    <div class="mt-10 flex justify-center items-center flex-col gap-y-2">
        <Spinner />
        <p>Waiting for answer...</p>
    </div>
{/if}

{#if answer}
    <div class="mt-8">
        <p class="font-medium">Answer:</p>
        <p>{answer}</p>
    </div>
{/if}