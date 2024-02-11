'use client'
export default function GET(request) {

  const submit = async (e) => {
    const num = document.getElementById('number').value;
    e.preventDefault();
    const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/padowan`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				number: num
			}),
		});
    var result=await response.json()
    alert(result.success)
  }

  return (
    <form>
      <label htmlFor="number">Account:</label>
      <input type='text' id='number' name='number' value='12345678' disabled/>

      <label htmlFor="name">Name:</label>
      <input type='text' name='name' />

      <button onClick={submit}>Submit</button>
    </form>


  )
}