import React from "react";

import CardProblemReport from "@/components/ProblemReport/CardProblemReport";
import QrCodeGenerator from "@/components/QrCodeGenarate";
function page() {
    return (
        <div>
            <CardProblemReport />
            <QrCodeGenerator />
        </div>
    );
}

export default page;
