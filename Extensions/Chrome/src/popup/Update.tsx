import * as React from 'react';
const API_ADDRESS = 'https://api.github.com/';

export const Update: React.FunctionComponent<{}> = ({ }) => {

    const [lastUpdated, setLastUpdated] = React.useState<number>(undefined);
    const [lastVersionCheck, setLastVersionCheck] = React.useState<number>(undefined);
    const [version, setVersion] = React.useState<string>(undefined);

    React.useEffect(() => {
        GetLatestRelease();
    })

    function GetLatestRelease() {
        setLastVersionCheck(Date.now);
        fetch(API_ADDRESS + `repos/acoop133/githubdarktheme/releases`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setVersion(data.tag_name);
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });

    }

    return <>
        {version === undefined && GetLatestRelease()}
        <div>Current version: {version}</div>

    </>

}
