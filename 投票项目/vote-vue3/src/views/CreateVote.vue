<template>
  <div class="create-vote">
    <h1>Create a New Vote</h1>
    <form>
      <div>
        <label for="title">Vote Title:</label>
        <input type="text" id="title" name="title" required />
      </div>
      <div>
        <label for="options">Options (comma separated):</label>
        <input type="text" id="options" name="options" required />
      </div>
      <button type="submit">Create Vote</button>
    </form>
  </div>
</template>

<style>

</style>
