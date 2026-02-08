import axios from 'axios'
import { Base_URL } from '../utils/constants'
import { useEffect, useState } from 'react'

const Payments = () => {
    const [isUserPremium, setIsUserPremium] = useState(false)
    const verifyPremiumUser = async () => {
        const res = await axios.get(Base_URL + "/premium/verify", { withCredentials: true })
        console.log(res.data.isPremium)
        if (res.data.isPremium) {
            setIsUserPremium(true)
        }
    }
    useEffect(() => { verifyPremiumUser() }, [])

    const handleClick = async (type) => {
        const order = await axios.post(Base_URL + "/payment/create", {
            membershipType: type,
        }, { withCredentials: true })
        // razorpay dialouge
        const { amount, currency, notes, orderId, } = order.data.savePayments
        const { keyId } = order.data
        const options = {
            key: keyId,
            amount: amount,
            currency,
            name: 'Acme Corp',
            description: 'Pay for the membership',
            order_id: orderId,
            notes,
            prefill: {
                name: 'Syed Ahad',
                email: 'syd.ahad@gmail.com',
                contact: '8081436076'
            },
            theme: {
                color: '#F37254'
            },
            handler: verifyPremiumUser
        };

        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    return (
        <> 
        {console.log(isUserPremium)}
            {isUserPremium ? <div> You are already a premium user</div> : <div>
                <div className="flex w-full">
                    <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
                        <h1 className='text-3xl font-bold'> Silver Plan</h1>
                        <div> <ul>
                            <li> Send unlimited connection requests</li>
                            <li>Send direct message</li>
                            <li>Get 20 swipes in a day</li>
                            <li>Be in the top of the feed in your area</li>
                        </ul></div>
                        <div> <button className='bg-gray-300 text-black p-2 rounded-2xl active:bg-amber-400 ' onClick={() => handleClick("silver")}
                        >
                            Buy Now</button>
                        </div>
                    </div>
                    <div className="divider divider-horizontal">OR</div>
                    <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
                        <h1 className='text-3xl font-bold'> Gold Plan</h1>
                        <div> <ul>
                            <li> Send unlimited connection requests</li>
                            <li>Send direct message</li>
                            <li>Get 20 swipes in a day</li>
                            <li>Be in the top of the feed in your area</li>
                            <li>Get the verefied profile tick</li>
                        </ul></div>
                        <div>
                            <button className='bg-amber-300 text-black p-2 rounded-2xl active:bg-amber-400 ' onClick={() => handleClick("gold")}
                            >
                                Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>}


        </>
    )
}

export default Payments
