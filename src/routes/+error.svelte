<script>
  import { page } from '$app/state';
</script>

{#if page.status === 404}
    <img src="/assets/404.png" alt="Fishes with safety hats swimming around floating text that says '404'">
{/if}

<h1>Oops...</h1>
<h2>Error {page.status}</h2>
<p>{page.error?.message}</p>
<p><a href="/">Go home</a>   <a href="javascript:history.back()">Go back</a></p>

<style>
    h1, h2 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 64px;
        font-style: normal;
        font-weight: 600;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
        width: 100%;
        text-align: center;
    }

    p {
        font-family: 'Roboto Flex';
        margin: 5px;
        width: 100%;
        text-align: center;
        color: #000;
        font-size: 25px;
        font-style: normal;
        font-weight: 300;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    img {
        width: 100%;
        height: 500px;
        object-fit: contain;
        margin-bottom: 20px;
    }

    a {
        color: #070f69;
    }

    a:hover {
        text-decoration: underline 2px;
    }
</style>