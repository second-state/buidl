pragma solidity >= 0.4.0 < 0.6.0;

contract DeveloperProfile {
    // These will be assigned at the construction phrase
    address public owner ;
    uint public creationTime;

    string public firstName;
    string public lastName;
    string public title;
    string public company;
    string public about;
    string public email;
    string public phone;
    string public website;
    string public twitter;
    string public facebook;
    string public linkedin;
    string public wechat;
    string public github;
    string public image0;
    string public image1;
    string public image2;
    string public image3;
    string public image4;
    string public image5;
    string public image6;
    string public image7;
    string public image8;
    string public image9;

    uint public votes;

    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    constructor(string _firstName, string _lastName, string _title, string _company, string _about, string _email, string _github, string _image0) public {
        owner = msg.sender;
        creationTime = now;

        firstName = _firstName;
        lastName = _lastName;
        title = _title;
        company = _company;
        about = _about;
        email = _email;
        github = _github;
        image0 = _image0;
    }

    function setFirstName (string _firstName) public onlyOwner {
        firstName = _firstName;
    }

    function setLastName (string _lastName) public onlyOwner {
        lastName = _lastName;
    }

    function setTitle (string _title) public onlyOwner {
        title = _title;
    }

    function setCompany (string _company) public onlyOwner {
        company = _company;
    }

    function setAbout (string _about) public onlyOwner {
        about = _about;
    }

    function setEmail (string _email) public onlyOwner {
        email = _email;
    }
    
    function setPhone (string _phone) public onlyOwner {
        phone = _phone;
    }

    function setWebsite (string _website) public onlyOwner {
        website = _website;
    }

    function setTwitter (string _twitter) public onlyOwner {
        twitter = _twitter;
    }

    function setFacebook (string _facebook) public onlyOwner {
        facebook = _facebook;
    }

    function setLinkedin (string _linkedin) public onlyOwner {
        linkedin = _linkedin;
    }

    function setWechat (string _wechat) public onlyOwner {
        wechat = _wechat;
    }

    function setGithub (string _github) public onlyOwner {
        github = _github;
    }

    function setImage0 (string _image0) public onlyOwner {
        image0 = _image0;
    }

    function setImage1 (string _image1) public onlyOwner {
        image1 = _image1;
    }

    function setImage2 (string _image2) public onlyOwner {
        image2 = _image2;
    }

    function setImage3 (string _image3) public onlyOwner {
        image3 = _image3;
    }

    function setImage4 (string _image4) public onlyOwner {
        image4 = _image4;
    }

    function setImage5 (string _image5) public onlyOwner {
        image5 = _image5;
    }

    function setImage6 (string _image6) public onlyOwner {
        image6 = _image6;
    }

    function setImage7 (string _image7) public onlyOwner {
        image7 = _image7;
    }

    function setImage8 (string _image8) public onlyOwner {
        image8 = _image8;
    }

    function setImage9 (string _image9) public onlyOwner {
        image9 = _image9;
    }

    function voteUp () public returns (uint) {
        votes = votes + 1;
        return votes;
    }
}
