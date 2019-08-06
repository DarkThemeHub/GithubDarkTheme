import * as React from 'react';

const API_ADDRESS = 'https://api.github.com/';

const UpdateUserTeamForm: React.StatelessComponent<{}> = ({ }) => {

    const [lastUpdated, setLastUpdated] = React.useState<number>(undefined);
    const [lastVersionCheck, setLastVersionCheck] = React.useState<number>(undefined);
    const [version, setVersion] = React.useState<string>();

    function GetLatestRelease() {
        fetch(API_ADDRESS + `repos/acoop133/githubdarktheme/releases`)
            .then(res => res.json())
            .then(result => {
                setVersion(result.tag_name);
                setLastVersionCheck(Date.now);
            })
    }

    return <>
        <div>Current version: {version}</div>

    </>

}
