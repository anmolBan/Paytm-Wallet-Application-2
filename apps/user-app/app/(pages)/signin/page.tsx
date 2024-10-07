"use client"

import { TextInput } from "@repo/ui/textinput";

export default async function(){
    return (
        <div>
            <TextInput placeholder="Enter the name." onChange={(value) => {
                console.log(value)
            }} label="Hi there" />
        </div>
    )
} 